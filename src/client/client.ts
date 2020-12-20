import got, {Got} from "got"
import {config} from "../config"
import {Schema} from "./clientTypes"

const client: Got = got.extend({
    prefixUrl: config.cockpitAPIURL,
    headers: {'Content-Type': 'application/json'},
    responseType: 'json',
    mutableDefaults: true,
})

export type CollectionProps = {
    id: string
}

// TODO: handle errors .catch((err) => console.log(err))
export const collectionSchema = ({id}: CollectionProps) =>
    client.get<Schema>(`collections/collection/${id}?token=${config.cockpitAPIToken}`)
        .then((res) => res.body)
