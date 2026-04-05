import { Provider } from "@/app/components/providers/provider";

export function withprovider(children: React.ReactNode) {
  return <Provider>{children}</Provider>;
}
