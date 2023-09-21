import { StatusHTTP } from '../../Interfaces/IServiceResponse';

const mapStatus = (status: keyof typeof StatusHTTP): number => StatusHTTP[status];

export default mapStatus;
