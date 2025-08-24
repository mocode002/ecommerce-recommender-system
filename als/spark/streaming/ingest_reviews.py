# # spark/streaming/enrich_reviews.py

# from pyspark.sql import SparkSession
# from pyspark.sql.functions import from_json, col
# from pyspark.sql.types import (
#     StructType, StructField,
#     DoubleType, BooleanType,
#     StringType, LongType,
#     MapType
# )

# if __name__ == "__main__":
#     spark = SparkSession.builder \
#         .appName("IngestReviews") \
#         .config("spark.sql.streaming.checkpointLocation", "file:///C:/spark_checkpoints") \
#         .config("spark.hadoop.fs.defaultFS", "file:///") \
#         .config(
#             "spark.jars.packages",
#             ",".join([
#                 "org.mongodb.spark:mongo-spark-connector_2.12:10.2.0",
#                 "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.5"
#             ])
#         ) \
#         .getOrCreate()

#     # Schema for incoming reviews
#     review_schema = StructType([
#         StructField("overall", DoubleType(), True),
#         StructField("verified", BooleanType(), True),
#         StructField("reviewTime", StringType(), True),
#         StructField("reviewerID", StringType(), True),
#         StructField("asin", StringType(), True),
#         StructField("style", MapType(StringType(), StringType()), True),
#         StructField("reviewerName", StringType(), True),
#         StructField("reviewText", StringType(), True),
#         StructField("summary", StringType(), True),
#         StructField("unixReviewTime", LongType(), True)
#     ])

#     # Read from Kafka
#     kafka_df = (
#         spark.readStream
#         .format("kafka")
#         .option("kafka.bootstrap.servers", "localhost:9092")
#         .option("subscribe", "review-events")
#         .option("startingOffsets", "latest")
#         .load()
#     )

#     # Parse JSON and select fields
#     reviews_df = (
#         kafka_df
#         .select(from_json(col("value").cast("string"), review_schema).alias("r"))
#         .select("r.*")
#     )

#     # 1. First write to console to see the streams
#     console_query = (
#         reviews_df
#         .writeStream
#         .outputMode("append")
#         .format("console")
#         .start()
#     )

#     # 2. (Optional) Keep your MongoDB write logic here if needed
#     # mongo_query = (
#     #     reviews_df
#     #     .writeStream
#     #     .format("mongo")
#     #     .option("checkpointLocation", "/checkpoints/enrich_reviews")
#     #     .option("uri", "mongodb://localhost:27017")
#     #     .option("database", "ecom")
#     #     .option("collection", "enriched_reviews")
#     #     .outputMode("append")
#     #     .start()
#     # )

#     # Wait for termination
#     console_query.awaitTermination()
#     # If using MongoDB: mongo_query.awaitTermination()



# spark/streaming/show_reviews.py
from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col
from pyspark.sql.types import *

if __name__ == "__main__":
    spark = SparkSession.builder \
        .appName("ShowReviews") \
        .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.5") \
        .config("spark.sql.streaming.checkpointLocation", "file:///tmp/spark_checkpoints") \
        .getOrCreate()

    # Define schema matching your JSON structure
    review_schema = StructType([
        StructField("overall", DoubleType()),
        StructField("verified", BooleanType()),
        StructField("reviewTime", StringType()),
        StructField("reviewerID", StringType()),
        StructField("asin", StringType()),
        StructField("style", MapType(StringType(), StringType())),
        StructField("reviewerName", StringType()),
        StructField("reviewText", StringType()),
        StructField("summary", StringType()),
        StructField("unixReviewTime", LongType())
    ])

    # Read from Kafka
    kafka_df = spark.readStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", "localhost:9092") \
        .option("subscribe", "review-events") \
        .option("startingOffsets", "earliest") \
        .load()

    # Parse JSON and show results
    parsed_df = kafka_df \
        .select(from_json(col("value").cast("string"), review_schema).alias("data")) \
        .select("data.*")

    console_query = parsed_df.writeStream \
        .outputMode("append") \
        .format("console") \
        .start()

    console_query.awaitTermination()