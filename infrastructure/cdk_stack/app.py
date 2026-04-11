#!/usr/bin/env python3
import aws_cdk as cdk
from cdk_stack.jaiib_stack import JaiibCaiibStack

app = cdk.App()
JaiibCaiibStack(app, "JaiibCaiibStack", env=cdk.Environment(
    account="123456789012",
    region="ap-south-1"
))
app.synth()
