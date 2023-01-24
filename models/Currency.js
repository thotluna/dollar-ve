import { randomUUID } from 'node:crypto'

export class Currency {
	#name
	#dollar
	#createdAt
	#time
	#id
	#euro
	#tweet

	static createToDb(string) {
		const [name, dollar, createdAt, time, id, euro, tweet] = string.replace('\n', '').split(', ')
		if (name === '') return

		return new this(
			name,
			Number(dollar),
			Number(createdAt),
			new Date(time),
			id,
			Number(euro),
			tweet
			)
	}

	constructor(name, dollar, createdAt, time, id, euro, tweet) {
		this.#name = name
		this.#dollar = dollar
		this.#createdAt = createdAt
		this.#time = time || new Date(createdAt).toISOString()
		this.#id = id || randomUUID()
		this.#euro = euro || 0.00
		this.#tweet = tweet || ''
	}

	toString() {
		return `${this.#name}, ${this.#dollar}, ${this.#createdAt}, ${this.#time}, ${this.#id}, ${this.#euro}, ${this.#tweet} \n`
	}

	name() {
		return this.#name
	}

	dollar() {
		return this.#dollar
	}

	createdAt() {
		return this.#createdAt
	}

	time() {
		return this.#time
	}

	id() {
		return this.#id
	}

	euro() {
		return this.#euro
	}

	tweet() {
		return this.#tweet
	}
}
