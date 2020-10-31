CloudFormation + CodePipeline Template Configuration For CLI Tools

Supported CLI Tools
 - `aws` <https://aws.amazon.com/cli/>
 - `sam` <https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html>
 - `rain` <https://github.com/aws-cloudformation/rain>

Fed up of the following commands all differing in their parameter overrides and tags parameter formats?

Do one of these:

```shell
$ tc aws cloudformation deploy ...
$ tc aws cloudformation create-change-set ... 
$ tc sam deploy ... 
$ tc rain deploy ...
```

With a default tempalte configuraiton file `template-configuration/default.json` (see <https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline-cfn-artifacts.html#w2ab1c21c17c15>)
```json
{
  "Parameters" : {
    "Key" : "Value"
  },
  "Tags" : {
    "TagKey" : "TagValue"
  }, 
  "StackPolicy" : {
    "Statement" : [
      {
        "Effect" : "Allow",
        "NotAction" : "Update:Delete",
        "Principal": "*",
        "Resource" : "*"
      }
    ]
  }
}
```

**so you don't have to do any of these:**

 ```shell
 $ aws cloudformation deploy \
   --parameter-overrides \
     Key=Value \
     Key2=Value2 \
   ...
 ```

 ```shell
 $ aws cloudformation create-change-set \
   --parameters \
     ParameterKey=Key,ParameterValue=Value \
     ParameterKey=Key2,ParameterValue=Value2 \
   ...
 ```
 
 ```shell
 $ sam deploy \
   --parameter-overrides \
     ParameterKey=Key,ParameterValue=Value \
     ParameterKey=Key2,ParameterValue=Value2 \
   ...
```

```shell
$ rain \
  --params \
    Key=Value,Key2=Value2
```


