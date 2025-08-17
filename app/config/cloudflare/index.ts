import { fetch } from "bun"

type flashType = {
    key: string,
    value: any,
    method?: "GET" | "PUT" | "DELETE"

}
const callFlash = async ({ key, value, method }: flashType) => {
    try {
        const API = process.env.FLASH_MAIN_URL ?? "";
        const payload = {
            key,
            value,
            method
        }
        const response = await fetch(API, {
            method: "POST",
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return [];
    }
}
const superStore = () => {
    return function () {
        async function get({ key, value }: flashType) {
            const keys = await callFlash({
                key,
                value,
                method: "GET"
            })
            return keys;
        }

        async function put({ key, value }: flashType) {
            const keys = await callFlash({
                key,
                value,
                method: "PUT"
            })
            return keys;
        }
        async function remove({ key, value }: flashType) {
            const keys = await callFlash({
                key,
                value,
                method: "PUT"
            })
            return keys;
        }

        return { get, put, remove }
    }
}

export { superStore }