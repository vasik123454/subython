import { NextApiHandler } from "next";
import { env } from "../../../env/server.mjs";

const StreamLabsRedirect: NextApiHandler = async (req, res) => {
  console.log("STREAMLABS REDIRECT QUERY: ", req.query);

  res.redirect(
    `https://www.streamlabs.com/api/v1.0/authorize?client_id=${env.SL_CLIENT_ID}&redirect_uri=${process.env.BASE_URL}/api/streamlabs/callback&response_type=code&scope=donations.read+donations.create+alerts.create+legacy.token+socket.token+points.read+points.write`
  );
};

export default StreamLabsRedirect;
