#!/usr/bin/env python3
"""
Lee y resume los JSON guardados por la Lambda en S3.
Uso local (LocalStack):
  set AWS_ENDPOINT_URL=http://localhost:4566
  set AWS_ACCESS_KEY_ID=test
  set AWS_SECRET_ACCESS_KEY=test
  python read_s3_results.py --bucket demo-resultados

Uso AWS:
  python read_s3_results.py --bucket demo-resultados-ACCOUNT_ID
"""

from __future__ import annotations

import argparse
import json
import os
from typing import Any

import boto3


def s3_client():
    kwargs: dict[str, Any] = {"region_name": os.getenv("AWS_REGION", "us-east-1")}
    endpoint = os.getenv("AWS_ENDPOINT_URL")
    if endpoint:
        kwargs["endpoint_url"] = endpoint
    return boto3.client("s3", **kwargs)


def list_records(bucket: str, prefix: str = "resultados/") -> list[dict]:
    client = s3_client()
    paginator = client.get_paginator("list_objects_v2")
    records: list[dict] = []

    for page in paginator.paginate(Bucket=bucket, Prefix=prefix):
        for obj in page.get("Contents", []):
            key = obj["Key"]
            body = client.get_object(Bucket=bucket, Key=key)["Body"].read()
            records.append(json.loads(body))

    return records


def print_summary(records: list[dict]) -> None:
    print(f"\n📊 {len(records)} registro(s) en S3\n")
    print("texto | palabras | caracteres | fecha")
    print("------|----------|------------|------")
    for r in records:
        print(
            f"{r.get('texto', '')} | {r.get('palabras', 0)} | "
            f"{r.get('caracteres', 0)} | {r.get('fecha', '')}"
        )

    if records:
        avg_words = sum(r.get("palabras", 0) for r in records) / len(records)
        print(f"\nPromedio palabras: {avg_words:.1f}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Consulta resultados en S3")
    parser.add_argument(
        "--bucket",
        default=os.getenv("BUCKET_NAME", "demo-resultados"),
        help="Nombre del bucket S3",
    )
    parser.add_argument("--prefix", default="resultados/")
    args = parser.parse_args()

    records = list_records(args.bucket, args.prefix)
    print_summary(records)


if __name__ == "__main__":
    main()
