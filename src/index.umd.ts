// UMD-specific entry point that exports the factory function as default
// with the Rokka class attached as a property for users who prefer class instantiation
import rokka, { Rokka } from './index'

const exports = rokka as typeof rokka & { Rokka: typeof Rokka }
exports.Rokka = Rokka

export default exports
