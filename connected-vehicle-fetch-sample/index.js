/*
  Copyright 2022 Volvo Car Corporation
  SPDX-License-Identifier: Apache-2.0
*/

import dotenv from "dotenv";

dotenv.config();

const baseUrl = "https://api.volvocars.com/connected-vehicle/v1";

const vccApiKey = process.env.VCC_API_KEY;
const accessToken = process.env.ACCESS_TOKEN;

const main = async () => {
  const vehicles = await fetchVehicles();

  console.log(
    `There are ${vehicles.length} cars connected to this Volvo ID account.`
  );

  // Loop though all vehicles to list their details.
  const promises = vehicles.map(async (vehicle) => {
    const details = await fetchVehicleDetails(vehicle.vin);
    const modelYear = details.modelYear;
    const model = details.descriptions.model;

    console.log(
      `Vehicle with VIN ${vehicle.vin} is a model ${model} from ${modelYear}.`
    );
  });

  await Promise.all(promises);
};

/**
 * Uses the vehicle list endpoint to fetch all cars connected to the Volvo ID.
 *
 * Full endpoint docs: https://developer.volvocars.com/apis/connected-vehicle/endpoints/vehicle/#list-vehicles
 */
const fetchVehicles = async () => {
  const response = await fetch(`${baseUrl}/vehicles`, {
    headers: {
      accept:
        "application/vnd.volvocars.api.connected-vehicle.vehiclelist.v1+json",
      "vcc-api-key": vccApiKey,
      authorization: `Bearer ${accessToken}`,
    },
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new RequestError(responseBody);
  }

  return responseBody.data;
};

/**
 * Uses the vehicle details endpoint to fetch details regarding the car.
 *
 * Full endpoint docs: https://developer.volvocars.com/apis/connected-vehicle/endpoints/vehicle/#get-vehicle-details
 */
const fetchVehicleDetails = async (vinNumber) => {
  const response = await fetch(`${baseUrl}/vehicles/${vinNumber}`, {
    headers: {
      accept: "application/vnd.volvocars.api.connected-vehicle.vehicle.v1+json",
      "vcc-api-key": vccApiKey,
      authorization: `Bearer ${accessToken}`,
    },
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new RequestError(responseBody);
  }

  return responseBody.data;
};

// Bootstrap the main method to run it with async syntax.
(async () => {
  await main();
})().catch((e) => {
  console.log(e);
});

class RequestError extends Error {
  constructor(data) {
    super(
      `Request failed with status ${data.status} and message "${data.error.message}"`
    );
  }
}
