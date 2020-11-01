CloudFormation + CodePipeline Template Configuration For CLI Tools

**See Limitations section towards the bottom**

Supported CLI Tools
 - `aws cloudformation` <https://aws.amazon.com/cli/>
   * `deploy | create-stack | create-change-set | create-stack-instances | create-stack-set | update-stack | update-stack-instances | update-stack-set`
 - `sam deploy` <https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html>
 - `rain deploy` <https://github.com/aws-cloudformation/rain>

Fed up of the following commands all differing in their parameter overrides and tags parameter formats? and them all differing from how CloudFormation Actions in CodePipeline are configuration?

Then do one of these:

```shell
$ tc aws cloudformation deploy ...
$ tc aws cloudformation create-change-set ... 
$ tc sam deploy ... 
$ tc rain deploy ...
```

With a template configuraiton file `template-configuration/default.json` (see <https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline-cfn-artifacts.html#w2ab1c21c17c15>)
```json
{
  "Parameters": {
    "Key": "Value"
  },
  "Tags": {
    "TagKey": "TagValue"
  }, 
  "StackPolicy": {
    "Statement": [
      {
        "Effect": "Allow",
        "NotAction": "Update:Delete",
        "Principal": "*",
        "Resource": "*"
      }
    ]
  }
}
```

And do away with your flakey non-production-live deploy scripts, **and stop
doing these:**

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

# Implicit Proxy

Add the following to your shell rc/profile file to replace `aws`, `sam`,
and/or `rain` with implicit `tc` proxying (e.g. `~/.bashrc`, `~/.zshrc`, etc)

```shell
aws () { template-configuration "$0" "$@" }
sam () { template-configuration "$0" "$@" }
rain () { template-configuration "$0" "$@" }
```

Then `tc` is implicit and no longer needed

```shell
$ aws cloudformation deploy ...
$ aws cloudformation create-change-set ...
$ sam deploy ...
$ rain deploy ...
```

# Limitations

 * only supports commands without global arguments between them (where they
   would otherwise be supported)
   * supported `aws cloudformation deploy ... --profile <profile> --region <region>`
   * **not-supported** `aws --profile <profile> --region <region> cloudformation deploy ...`
 * only supports proxying to help commands where help arguments are the last argument e.g. `aws cloudformation deploy help`
 * does not and _does not plan to_ support merging each commands existing
   parameter arguments with a template configuration file
 * [ ] add support for `tc --parameters ... [cmd ...]` for 1 single way
     override template configuration file values
 * [ ] test / add support for parameters with quoted values
 * [ ] support `UsePreviousValue`


# Arguments

Some arguments can come before the proxied command e.g. `tc <here> aws ...`

 * `--debug` echos out the command that is also ran
 * `--dryrun` only echo out the command that would otherwise be ran – implies `--debug`
 * `--config <configuration-file>` override `template-configuration/default.json` with another local file path
   * e.g. `tc --config template-configuration/test.json sam deploy ...`
