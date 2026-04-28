import { Timestamp } from '../Timestamp'
export default () => <Timestamp value={Date.now() - 60_000} display="relative" />
