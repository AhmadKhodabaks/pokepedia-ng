export interface Pokemon {
    id: number,
    image: string,
    name: string,
    url: string
}

export interface PokemonResponse {
    count: number,
    next: string,
    previous: string,
    results: Pokemon[],
}
