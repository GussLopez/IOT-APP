"use client"

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useRef } from "react"
import Spinner from "./Spinner"

mapboxgl.accessToken = "pk.eyJ1IjoiZ3VzLWxweiIsImEiOiJjbTI5MG43Z3YwMDlmMmpwemdyZnVoeDVxIn0.bA2KgGcCvYZpPdLHuw2UCQ"

export default function Map(data: any) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const { parcelas } = data

  useEffect(() => {
    if (!mapContainer.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [-86.87, 21.06],
      zoom: 13,
    })

    map.addControl(new mapboxgl.NavigationControl(), "top-right")

    const addMarkers = () => {
      parcelas.forEach((parcela: any) => {
        // Crear el contenido HTML del popup
        const popupHTML = `
          <div style="padding: 10px; max-width: 300px;">
            <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: #3b82f6;">${parcela.nombre}</h3>
            <div>
              <p style="margin: 5px 0;"><strong>Ubicación:</strong> ${parcela.ubicacion}</p>
              <p style="margin: 5px 0;"><strong>Responsable:</strong> ${parcela.responsable}</p>
              <p style="margin: 5px 0;"><strong>Cultivo:</strong> ${parcela.tipo_cultivo}</p>
              ${
                parcela.ultimo_riego
                  ? `<p style="margin: 5px 0;"><strong>Último riego:</strong> ${new Date(parcela.ultimo_riego).toLocaleString()}</p>`
                  : ""
              }
              ${
                parcela.sensor
                  ? `
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                  <p style="margin: 5px 0;"><strong>Humedad:</strong> ${parcela.sensor.humedad}%</p>
                  <p style="margin: 5px 0;"><strong>Temperatura:</strong> ${parcela.sensor.temperatura}°C</p>
                </div>
              `
                  : ""
              }
            </div>
          </div>
        `

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: true,
          maxWidth: "300px",
        }).setHTML(popupHTML)

        new mapboxgl.Marker({ color: "#3b82f6" })
          .setLngLat([parcela.longitud, parcela.latitud])
          .setPopup(popup)
          .addTo(map)
      })
    }

    if (map.loaded()) {
      addMarkers()
    } else {
      map.on("load", addMarkers)
    }

    return () => {
      map.remove()
    }
  }, [parcelas])

  if (!parcelas) return <Spinner />

  return (
    <div className="w-full h-[500px]">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
}

