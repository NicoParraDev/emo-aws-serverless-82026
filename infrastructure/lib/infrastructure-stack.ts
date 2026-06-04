import * as path from "path";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as apigwIntegrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as iam from "aws-cdk-lib/aws-iam";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const resultsBucket = new s3.Bucket(this, "ResultsBucket", {
      bucketName: `demo-resultados-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const athenaResultsBucket = new s3.Bucket(this, "AthenaResultsBucket", {
      bucketName: `demo-athena-results-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const webBucket = new s3.Bucket(this, "WebBucket", {
      bucketName: `demo-web-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const repoRoot = path.join(__dirname, "../..");

    const processLambda = new NodejsFunction(this, "ProcessLambda", {
      projectRoot: repoRoot,
      depsLockFilePath: path.join(repoRoot, "backend/package-lock.json"),
      entry: path.join(repoRoot, "backend/src/handler.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        BUCKET_NAME: resultsBucket.bucketName,
      },
      bundling: {
        minify: true,
        sourceMap: true,
        target: "node20",
      },
    });

    resultsBucket.grantReadWrite(processLambda);

    const httpApi = new apigwv2.HttpApi(this, "DemoHttpApi", {
      apiName: "demo-serverless-api",
      description: "API Gateway para Lambda de procesamiento de texto",
      corsPreflight: {
        allowHeaders: ["*"],
        allowMethods: [
          apigwv2.CorsHttpMethod.POST,
          apigwv2.CorsHttpMethod.OPTIONS,
        ],
        allowOrigins: ["*"],
      },
    });

    httpApi.addRoutes({
      path: "/procesar",
      methods: [apigwv2.HttpMethod.POST],
      integration: new apigwIntegrations.HttpLambdaIntegration(
        "ProcesarIntegration",
        processLambda
      ),
    });

    const apiDomain = `${httpApi.httpApiId}.execute-api.${this.region}.amazonaws.com`;

    const apiOrigin = new origins.HttpOrigin(apiDomain, {
      protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
    });

    const webOrigin = origins.S3BucketOrigin.withOriginAccessControl(webBucket);

    const distribution = new cloudfront.Distribution(this, "WebDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: webOrigin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      },
      additionalBehaviors: {
        "/procesar": {
          origin: apiOrigin,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy:
            cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        },
      },
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(5),
        },
      ],
    });

    const frontendBuildPath = path.join(repoRoot, "frontend/build");

    new s3deploy.BucketDeployment(this, "DeployFrontend", {
      sources: [s3deploy.Source.asset(frontendBuildPath)],
      destinationBucket: webBucket,
      distribution,
      distributionPaths: ["/*"],
      prune: true,
    });

    processLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["s3:ListBucket"],
        resources: [resultsBucket.bucketArn],
      })
    );

    new cdk.CfnOutput(this, "CloudFrontUrl", {
      value: `https://${distribution.distributionDomainName}`,
      description: "URL del frontend (React) + /procesar via CloudFront",
    });

    new cdk.CfnOutput(this, "ApiGatewayUrl", {
      value: `${httpApi.apiEndpoint}/procesar`,
      description: "URL directa API Gateway POST /procesar",
    });

    new cdk.CfnOutput(this, "ResultsBucketName", {
      value: resultsBucket.bucketName,
    });

    new cdk.CfnOutput(this, "AthenaResultsBucketName", {
      value: athenaResultsBucket.bucketName,
    });

    new cdk.CfnOutput(this, "LambdaFunctionName", {
      value: processLambda.functionName,
    });
  }
}
