from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col
from pyspark.sql.types import (
    StructType, StructField,
    DoubleType, BooleanType,
    StringType, LongType,
    MapType
)
import os

if __name__ == "__main__":
    # 1) Create a real checkpoint (Linux local path)
    ckpt = os.path.expanduser("~/data/checkpoints/project_ratings")
    os.makedirs(os.path.join(ckpt, "console"), exist_ok=True)


    # 2) Build SparkSession with Kafka connector & local FS
    spark = (
        SparkSession.builder
            .appName("ProjectRatings")
            .master("local[*]")
            .config("spark.hadoop.fs.defaultFS", "file:///")
            .config(
                "spark.jars.packages",
                "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.5"
            )
            .getOrCreate()
    )

    # 3) Define the schema for your full review JSON
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

    # 4) Read from Kafka
    kafka_df = (
        spark.readStream
             .format("kafka")
             .option("kafka.bootstrap.servers", "localhost:19092")
             .option("subscribe", "review-events")
             .option("startingOffsets", "earliest")
             .load()
    )

    # 5) Parse & project to ratings schema
    ratings_stream = (
        kafka_df
        .select(from_json(col("value").cast("string"), review_schema).alias("r"))
        .select(
            col("r.asin"          ).alias("itemId"),
            col("r.reviewerID"    ).alias("userId"),
            col("r.overall"       ).alias("rating"),
            col("r.unixReviewTime").alias("timestamp")
        )
    )

    # 6) Write to console with a real checkpoint
    query = (
        ratings_stream
        .writeStream
        .format("console")
        .option("truncate", False)
        .option("numRows", 10)
        .option("checkpointLocation", os.path.join(ckpt, "console"))
        .outputMode("append")
        .start()
    )

    query.awaitTermination()
