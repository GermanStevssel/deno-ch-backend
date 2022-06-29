// @deno-types='https://deno.land/x/servest@v1.3.4/types/react/index.d.ts'
import React from "https://dev.jspm.io/react/index.js";
// @deno-types='https://deno.land/x/servest@v1.3.4/types/react-dom/server/index.d.ts'
import ReactDOMServer from "https://dev.jspm.io/react-dom/server.js";
import { createApp } from "https://deno.land/x/servest@v1.3.4/mod.ts";

const app = createApp();

const env = Deno.env.toObject();
const PORT = env.PORT || 8080;
const colors: Array<string> = [];

const bodyContent = () => {
	ReactDOMServer.renderToString(
		<html>
			<head>
				<meta charset="UTF-8" />
				<meta http-equiv="X-UA-Compatible" content="IE=edge" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Colores</title>
			</head>
			<body style={{ background: "#000000", color: "#FFF" }}>
				<form method="POST">
					<label for="color">Indica tus colores favoritos</label>
					<br />
					<input type="text" id="color" name="color" />
					<br />
					<input type="submit" value="Send" />
				</form>
				{Boolean(colors.length) && (
					<ul>
						{colors.map((color, index) => (
							<li key={index} style={{ color }}>
								{color}
							</li>
						))}
					</ul>
				)}
			</body>
		</html>
	);
};

app.get("/", async (req) => {
	await req.respond({
		status: 200,
		headers: new Headers({
			"content-type": "text/html; charset=UTF-8",
		}),
		body: bodyContent(),
	});
});

app.post("/", async (req) => {
	const color = await req.formData().value("color");
	if (color) {
		colors = [...colors, color];
	}

	req.respond({
		status: 200,
		headers: new Headers({
			"content-type": "text/html; charset=UTF-8",
		}),
		body: bodyContent(),
	});
});

app.listen({ port: PORT });
// app.listen({ port: Number(Deno.env.get("PORT")) || 8080 });
