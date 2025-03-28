import type { CorsOptions } from "cors"

export const corsConfig: CorsOptions = {
  origin(origin, callback) {
    const whiteList = ['http://localhost:5173']

    if (process.argv[2] === "--api") {
      whiteList.push(undefined, "http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173")
    }

    if (whiteList.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Error de cors"))
    }
  },
}

