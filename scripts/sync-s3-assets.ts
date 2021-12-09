require("dotenv").config();
import fs, { Stats } from "fs";
import AWS from "aws-sdk";
import path from "path";

const walk = (
  currentDirPath: string,
  callback: (filePath: string, stat: Stats) => void
) => {
  fs.readdirSync(currentDirPath).forEach((name) => {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) callback(filePath, stat);
    else if (stat.isDirectory()) walk(filePath, callback);
  });
};

const syncDir = ({
  from,
  bucket,
  accessKeyId,
  secretAccessKey,
  skipUploaded = true,
}: {
  from: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  skipUploaded?: boolean;
}) => {
  const s3 = new AWS.S3(
    new AWS.Config({
      accessKeyId,
      secretAccessKey,
      maxRetries: 5,
      retryDelayOptions: {
        base: 1000,
      },
    })
  );

  walk(from, async (filePath) => {
    const bucketPath = filePath.substring(from.length + 1).replace(/\\/g, "/");

    let exists = false;
    if (skipUploaded) {
      exists = await new Promise((resolve) =>
        s3.headObject(
          {
            Bucket: bucket,
            Key: bucketPath,
          },
          (err) => {
            resolve(err ? false : true);
          }
        )
      );
    }

    if (exists) console.log(`Skipping ${bucket}/${bucketPath}`);
    else {
      s3.putObject(
        {
          Bucket: bucket,
          Key: bucketPath,
          Body: fs.readFileSync(filePath),
          ACL: "public-read",
        },
        (err) => {
          if (err) console.log(err);
          else console.log(`Uploaded ${bucket}/${bucketPath}`);
        }
      );
    }
  });
};

syncDir({
  from: path.join(process.cwd(), String(process.env.AWS_S3_ASSETS_DIR)),
  bucket: String(process.env.AWS_S3_BUCKET),
  accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
  secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
});
