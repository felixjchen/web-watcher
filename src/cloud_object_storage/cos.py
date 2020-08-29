
import os
import ibm_boto3
from ibm_botocore.client import Config, ClientError

production = 'KUBERNETES_SERVICE_HOST' in os.environ

if production:
    COS_API_KEY_ID = os.environ['SECRET_APIKEY']
    COS_RESOURCE_CRN = os.environ['SECRET_RESOURCE_INSTANCE_ID']
else:
    import secrets
    COS_API_KEY_ID = secrets.credentials['apikey']
    COS_RESOURCE_CRN = secrets.credentials['resource_instance_id']

# https://cloud.ibm.com/docs/services/cloud-object-storage?topic=cloud-object-storage-endpoints#endpoints
COS_ENDPOINT = "https://s3.us-east.cloud-object-storage.appdomain.cloud"
# https://cloud.ibm.com/docs/services/cloud-object-storage?topic=cloud-object-storage-classes#classes-locationconstraint
COS_BUCKET_LOCATION = "us-east-standard"
COS_AUTH_ENDPOINT = "https://iam.cloud.ibm.com/identity/token"

# Create resource
file_bucket = "web-watcher-prod" if production else "web-watcher-dev"
cos = ibm_boto3.resource("s3",
                         ibm_api_key_id=COS_API_KEY_ID,
                         ibm_service_instance_id=COS_RESOURCE_CRN,
                         ibm_auth_endpoint=COS_AUTH_ENDPOINT,
                         config=Config(signature_version="oauth"),
                         endpoint_url=COS_ENDPOINT
                         )


def get_item(file_path, item_name):

    try:
        file = cos.Object(file_bucket, item_name)

        with open(file_path, 'wb') as data:
            file.download_fileobj(data)

        print("Get item for {0} Complete!\n".format(item_name))
        return True

    except ClientError as be:
        print("CLIENT ERROR: {0}\n".format(be))
    except Exception as e:
        print("Unable to retrieve file contents: {0}".format(e))

    return False


def delete_item(item_name):
    try:
        cos.Object(file_bucket, item_name).delete()
        print("Item: {0} deleted!".format(item_name))
        return True

    except ClientError as be:
        print("CLIENT ERROR: {0}\n".format(be))
    except Exception as e:
        print("Unable to delete item: {0}".format(e))

    return False


def multi_part_upload(file_path, item_name):
    try:
        # set 5 MB chunks
        part_size = 1024 * 1024 * 5

        # set threadhold to 15 MB
        file_threshold = 1024 * 1024 * 15

        # set the transfer threshold and chunk size
        transfer_config = ibm_boto3.s3.transfer.TransferConfig(
            multipart_threshold=file_threshold,
            multipart_chunksize=part_size
        )

        # the upload_fileobj method will automatically execute a multi-part upload
        # in 5 MB chunks for all files over 15 MB
        with open(file_path, "rb") as file_data:
            cos.Object(file_bucket, item_name).upload_fileobj(
                Fileobj=file_data,
                Config=transfer_config
            )

        print("Transfer for {0} Complete!\n".format(item_name))
        return True

    except ClientError as be:
        print("CLIENT ERROR: {0}\n".format(be))
    except Exception as e:
        print("Unable to complete multi-part upload: {0}".format(e))

    return False


# print(get_bucket_contents())
print(delete_item('index.js'))
