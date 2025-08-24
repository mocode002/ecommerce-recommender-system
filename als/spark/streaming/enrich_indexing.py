import os
from pyspark.sql import SparkSession
from pyspark.ml.feature import StringIndexerModel

def disable_file_lock(spark):
    hadoop_conf = spark._jsc.hadoopConfiguration()
    hadoop_conf.set("dfs.client.use.datanode.hostname", "true")
    hadoop_conf.set("fs.file.impl.disable.cache", "true")

if __name__ == "__main__":
    # Absolute paths (Linux-style)
    USER_INDEXER_PATH = os.path.abspath("als/models/bigdata/indexers/user_indexer")
    ITEM_INDEXER_PATH = os.path.abspath("als/models/bigdata/indexers/item_indexer")

    # Start Spark session
    spark = (
        SparkSession.builder
            .appName("LoadIndexersOnly")
            .master("local[*]")
            .getOrCreate()
    )

    disable_file_lock(spark)

    try:
        # Load models
        user_indexer_model = StringIndexerModel.load(USER_INDEXER_PATH)
        item_indexer_model = StringIndexerModel.load(ITEM_INDEXER_PATH)

        # Display labels to verify the models
        print("User Indexer Labels:", user_indexer_model.labels)
        print("Item Indexer Labels:", item_indexer_model.labels)

    except Exception as e:
        print("Error loading indexer models:", e)

    spark.stop()
