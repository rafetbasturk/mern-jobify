import * as dotenv from "dotenv"
dotenv.config();
import { readFile } from "fs/promises";
import connectDB from "./db/connect.js";
import Job from "./models/jobModel.js";

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    // await Job.deleteMany();

    // const data = JSON.parse(await readFile(new URL("./mock-data.json", import.meta.url)))
    const data = JSON.parse(await readFile(`./mock-data-test.json`));
    await Job.create(data);
    console.log("Success");
    process.exit(0)
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
}

start()