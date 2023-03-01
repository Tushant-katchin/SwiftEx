import { getAuth } from "./api";
import ExchangeRoutes from "./exchangeRoutes";

const ExchangeApp = () => {
  const isAuth = getAuth();

  if (isAuth) {
    return <ExchangeRoutes />;
  }
  return <ExchangeLogin />;
};
