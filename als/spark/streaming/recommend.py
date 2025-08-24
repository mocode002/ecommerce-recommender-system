from pyspark.ml.recommendation import ALSModel
from pyspark.sql.functions import col, lit
import os

def recommend_for_user(spark, user_id, user_segments_df, indexers, top_n=5):
    """
    Recommends top-N items for a given user based on their cluster.

    Parameters:
    - user_id (str): ID of the user
    - user_segments_df (DataFrame): must contain 'reviewerID' and 'prediction' columns
    - indexers (dict): {"user": user_indexer_model, "item": item_indexer_model}
    - top_n (int): number of recommendations

    Returns:
    - DataFrame with recommendations (itemId, predicted rating)
    """

    # Step 1: Get cluster for user
    cluster_row = user_segments_df.filter(col("reviewerID") == user_id).select("prediction").collect()
    if not cluster_row:
        print(f"User {user_id} not found in segmentation.")
        return None
    cluster_id = cluster_row[0]["prediction"]

    # Step 2: Load ALS model
    model_path = f"/content/new/als_models/als_model_cluster_{cluster_id}"
    if not os.path.exists(model_path):
        print(f"Model path {model_path} does not exist.")
        return None
    als_model = ALSModel.load(model_path)

    # Step 3: Get indexed user ID
    user_index_model = indexers["user"]
    item_index_model = indexers["item"]

    user_indexed_df = user_index_model.transform(
        spark.createDataFrame([(user_id,)], ["userId"])
    )
    user_indexed = user_indexed_df.select("userIdIndex").collect()[0][0]

    # Step 4: Create item DataFrame and index it
    item_ids = [(item,) for item in item_index_model.labels]  # labels contains original item IDs
    item_df = spark.createDataFrame(item_ids, ["itemId"])
    item_indexed_df = item_index_model.transform(item_df)

    # Step 5: Create input for ALS: user + all item indices
    # user_items = item_indexed_df.withColumn("userIndex", lit(user_indexed))
    user_items = item_indexed_df.withColumn("userIdIndex", lit(user_indexed)) \
                            # .withColumnRenamed("itemIdIndex", "itemIdIndex")

    # Step 6: Predict ratings
    recommendations = als_model.transform(user_items).dropna().orderBy("prediction", ascending=False)

    # Step 7: Return top-N recommendations with original itemId
    final_recommendations = recommendations.select("itemId", "prediction").limit(top_n)

    return final_recommendations