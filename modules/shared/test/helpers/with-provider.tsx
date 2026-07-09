import { Provider } from "../../components/providers/provider";

export function withprovider(children: React.ReactNode) {
  return <Provider>{children}</Provider>;
}
