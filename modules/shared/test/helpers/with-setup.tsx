import { withprovider } from "./with-provider";
import { withQuery } from "./with-query";

export function withSetup(children: React.ReactNode) {
  return withQuery(withprovider(children));
}
