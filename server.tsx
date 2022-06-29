// @deno-types='https://deno.land/x/servest@v1.3.4/types/react/index.d.ts'
import React from "https://dev.jspm.io/react/index.js";
// @deno-types='https://deno.land/x/servest@v1.3.4/types/react-dom/server/index.d.ts'
import ReactDOMServer from "https://dev.jspm.io/react-dom/server.js";
import {
	contentTypeFilter,
	createApp,
} from "https://deno.land/x/servest@v1.3.4/mod.ts";

const app = createApp();

const env = Deno.env.toObject();

let colors: Array<string> = [];

const body = () =>
	ReactDOMServer.renderToString(
		<html>
			<head>
				<meta charSet="UTF-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Colores</title>
			</head>
			<body>
				<h1
					style={{
						display: "flex",
						justifyContent: "center",
					}}
				>
					Colores Favoritos
				</h1>
				<form
					method="POST"
					style={{
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
						alignItems: "center",
						maxWidth: "400px",
						margin: "auto",
					}}
				>
					<label htmlFor="color">Indica tus colores favoritos</label>
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

app.get("/", async (req) => {
	await req.respond({
		status: 200,
		headers: new Headers({
			"content-type": "text/html; charset=UTF-8",
		}),
		body: body(),
	});
});

app.post(
	"/",
	contentTypeFilter("application/x-www-form-urlencoded"),
	async (req) => {
		const form = await req.formData();
		const color = form!.value("color");
		if (color) {
			colors = [...colors, color];
		}

		req.respond({
			status: 200,
			headers: new Headers({
				"content-type": "text/html; charset=UTF-8",
			}),
			body: body(),
		});
	}
);

const PORT = env.PORT || 8080;
app.listen({ port: PORT });
