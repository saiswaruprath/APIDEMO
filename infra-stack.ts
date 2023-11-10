import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as s3 from 'aws-cdk-lib/aws-s3'
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here


    const balancestatuss3 =  new s3.Bucket(this, "s3bucketlogicalid", {
      bucketName: 'bstatus456'
    })


     //IAM Role
     const iambalancestatusrole = new iam.Role(this,"iambalancerole",{
      roleName:'bankingLambdaRole',
      description:'role for lambda to access S3 bucket',
      assumedBy:new iam.ServicePrincipal('lambda.amazonaws.com')
     })
     iambalancestatusrole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));
     
     //Lambda Function 
     const bankingLambdafunction = new lambda.Function(this,"lambdalogicalid",{
      handler:'lambda_function.lambda_handler',
      runtime:lambda.Runtime.PYTHON_3_7,
      code:lambda.Code.fromAsset('../services/'),
      role:iambalancestatusrole,
     })

    // //API Gateway
 
     const bankingrestapi = new apigateway.LambdaRestApi(this,"bankingrestapi",{
      handler:bankingLambdafunction,
      restApiName:'bankingrestapi',
      deploy:true,
      proxy:false,
     })
      const bankstatus = bankingrestapi.root.addResource('bankstatus');
      bankstatus.addMethod('GET');


  }
}
