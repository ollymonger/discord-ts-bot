export interface ExtendedRoleType {
    id: string
    guild: string
    name: string
    color: number
    hoist: boolean
    rawPosition: number
    permissions: number
    managed: boolean
    mentionable: boolean
    deleted: boolean
    tags: null
    createdTimestamp: Date
}

/*
[
    {
        "guild": "215874415055863811",
        "id": "151018674793349121",
        "name": "Discoid",
        "color": 0,
        "hoist": false,
        "rawPosition": 5,
        "permissions": 6442745422,
        "managed": false,
        "mentionable": false,
        "deleted": false,
        "tags": null,
        "createdTimestamp": 1456076057862
    }
]*/
