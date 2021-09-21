import cls from 'cls-hooked'
import { Sequelize } from 'sequelize'

export default class Database {
  constructor(environment, dbConfig) {
    this.environment = environment
    this.dbConfig = dbConfig
    this.isTestEnvironment = this.environment === 'test'
  }

  async connect() {
    // Set up the namespace for transactions -- cls-hooked
    const namespace = cls.createNamespace('transactions-namespace')
    Sequelize.useCLS(namespace)

    // Create the connection
    const { username, password, host, port, database, dialect } = this.dbConfig(
      this.environment
    )
    this.connection = new Sequelize({
      username,
      password,
      host,
      port,
      database,
      dialect,
      logging: this.isTestEnvironment ? false : console.log,
    })

    await this.connection.authenticate({ logging: false })

    if (!this.isTestEnvironment) {
      console.log(
        'Connection to the database has been established successfully'
      )
    }

    // TODO: Register the models
    // registerModels(this.connection)

    // Sync the models
    await this.sync()
  }

  async disconnect() {}

  async sync() {
    await this.connection.sync({
      logging: false,
      force: this.isTestEnvironment,
    })

    if (!this.isTestEnvironment) {
      console.log('Connection synced successfully')
    }
  }
}
