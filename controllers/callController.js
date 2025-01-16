const { AccessToken } = require("livekit-server-sdk");
const getToken = async (req, res) => {
  try {
    const participantName = req.query.name;
    const roomName = "AJ-Chat-Room";
    // Identifier to be used for participant.
    // It's available as LocalParticipant.identity with livekit-client SDK
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: participantName,
        // Token to expire after 10 minutes
        ttl: "1h",
      }
    );
    at.addGrant({ roomJoin: true, room: roomName });

    const token = await at.toJwt();

    res.send(token);
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { getToken };
