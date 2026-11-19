export default {
  async fetch(request) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    const url = new URL(request.url);

    if (url.pathname !== "/price") {
      return Response.json(
        {
          status: "online",
          name: "GOLD MASTER AI",
          endpoint: "/price"
        },
        { headers: cors }
      );
    }

    try {
      const response = await fetch(
        "https://xaus.com/api/v1/spot?compact=1",
        {
          headers: {
            "Accept": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error("XAUS HTTP " + response.status);
      }

      const data = await response.json();

      return Response.json(
        {
          status: "success",
          source: "XAUS",
          updated_at: new Date().toISOString(),
          data
        },
        {
          headers: {
            ...cors,
            "Cache-Control": "no-store"
          }
        }
      );
    } catch (error) {
      return Response.json(
        {
          status: "error",
          message: error.message,
          source: "XAUS"
        },
        {
          status: 502,
          headers: cors
        }
      );
    }
  }
};
