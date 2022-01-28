import { food } from "./food";

export interface order {
    order_id: string
    table_NO: string
    typeOrder: string
    number: number
    priceTotal: number
    foodList: food[]
    status: string
    creationDatetime: Date
    promotion: string

    emp_Name: string
    paytime: Date
    bestTypes: bestType[]
    bestFoods: bestFood[]
    netPrice: number
    valuePromotion: number
}

export interface bestType {
    name: string
    number: number
    price: number
    rate: number
}
export interface bestFood {
    type_name: string
    number: number
    price: number
    rate: number
}