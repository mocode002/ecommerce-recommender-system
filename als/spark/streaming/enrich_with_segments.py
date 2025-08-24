from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, broadcast
from pyspark.sql.types import (
    StructType, StructField,
    DoubleType, BooleanType,
    StringType, LongType,
    MapType
)
import os

if __name__ == "__main__":
    # Prepare checkpoint directory
    ckpt = os.path.expanduser("~/data/checkpoints/project_ratings")
    os.makedirs(os.path.join(ckpt, "console"), exist_ok=True)

    spark = (
        SparkSession.builder
            .appName("RatingsWithSegments")
            .master("local[*]")
            .config("spark.hadoop.fs.defaultFS", "file:///")
            .config(
                "spark.jars.packages",
                ",".join([
                    "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.5"
                ])
            )
            .getOrCreate()
    )

    # 1) Define review JSON schema
    review_schema = StructType([
        StructField("overall",        DoubleType(), True),
        StructField("verified",       BooleanType(), True),
        StructField("reviewTime",     StringType(),  True),
        StructField("reviewerID",     StringType(),  True),
        StructField("asin",           StringType(),  True),
        StructField("style",          MapType(StringType(), StringType()), True),
        StructField("reviewerName",   StringType(),  True),
        StructField("reviewText",     StringType(),  True),
        StructField("summary",        StringType(),  True),
        StructField("unixReviewTime", LongType(),    True)
    ])

    # 2) Read static user segments from Parquet
    segments = (
        spark.read
             .parquet("als/models/bigdata/user_segments.parquet")
             .select(
                 col("reviewerID").alias("userId"),
                 col("prediction")
             )
    )

    # 3) Ingest reviews from Kafka
    kafka_df = (
        spark.readStream
             .format("kafka")
             .option("kafka.bootstrap.servers", "localhost:19092")
             .option("subscribe", "review-events")
             .option("startingOffsets", "earliest")
             .load()
    )

    # 4) Parse JSON and project to (itemId, userId, rating, timestamp)
    ratings = (
        kafka_df
        .select(from_json(col("value").cast("string"), review_schema).alias("r"))
        .select(
            col("r.asin").alias("itemId"),
            col("r.reviewerID").alias("userId"),
            col("r.overall").alias("rating"),
            col("r.unixReviewTime").alias("timestamp")
        )
    )

    # 5) Enrich by joining with segments (broadcast for small table)
    enriched = ratings.join(
        broadcast(segments),
        on="userId",
        how="inner"
    )

    from pyspark.ml.feature import StringIndexerModel

    USER_INDEXER_PATH = os.path.abspath("als/models/bigdata/indexers/user_indexer")
    ITEM_INDEXER_PATH = os.path.abspath("als/models/bigdata/indexers/item_indexer")

    user_indexer_model = StringIndexerModel.load(USER_INDEXER_PATH)
    item_indexer_model = StringIndexerModel.load(ITEM_INDEXER_PATH)

    # Apply indexers
    ratings_indexed = user_indexer_model.transform(enriched)
    ratings_indexed = item_indexer_model.transform(ratings_indexed)

    # Stream output
    query = (
        ratings_indexed
            .select("userId", "userIdIndex", "itemId", "itemIdIndex", "rating", "prediction")
            .writeStream
            .format("console")
            .option("truncate", False)
            .option("numRows", 10)
            .option("checkpointLocation", os.path.join(ckpt, "console"))
            .outputMode("append")
            .start()
    )


    # 6) Output to console
    # query = (
    #     enriched.writeStream
    #             .format("console")
    #             .option("truncate", False)
    #             .option("numRows", 10)
    #             .option("checkpointLocation", os.path.join(ckpt, "console"))
    #             .outputMode("append")
    #             .start()
    # )

    query.awaitTermination()
