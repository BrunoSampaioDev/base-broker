/* eslint-disable @typescript-eslint/no-require-imports */
const jsonServer = require("json-server");
const { v4: uuidv4 } = require("uuid");

const server = jsonServer.create();
const router = jsonServer.router("json-server/db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post("/orders", (req, res) => {
  const db = router.db;

  const newOrder = {
    id: uuidv4(),
    instrument: req.body.instrument,
    side: req.body.side,
    price: Number(req.body.price),
    quantity: Number(req.body.quantity),
    remaining: Number(req.body.quantity),
    status: "OPEN",
    createdAt: new Date().toISOString(),
  };

  db.get("orders").push(newOrder).write();

  const savedOrder = db.get("orders").find({ id: newOrder.id }).value();

  matchOrders(savedOrder, db);

  const finalOrder = db.get("orders").find({ id: newOrder.id }).value();

  res.status(201).json(finalOrder);
});

server.patch("/orders/:id/cancel", (req, res) => {
  const db = router.db;
  const order = db.get("orders").find({ id: req.params.id }).value();

  if (!order) {
    return res.status(404).json({ error: "Ordem não encontrada" });
  }

  if (!["OPEN", "PARTIAL"].includes(order.status)) {
    return res.status(400).json({ error: "Ordem não pode ser cancelada" });
  }

  const executedQuantity = order.quantity - order.remaining;

  order.status = "CANCELLED";
  db.write();

  addHistory(db, order, executedQuantity);

  res.json(order);
});

server.get("/book", (req, res) => {
  const db = router.db;
  const orders = db
    .get("orders")
    .filter((o) => ["OPEN", "PARTIAL"].includes(o.status))
    .value();

  const sellOrders = orders
    ?.filter((o) => o.side === "SELL")
    .sort((a, b) => b.price - a.price);

  const buyOrders = orders
    ?.filter((o) => o.side === "BUY")
    .sort((a, b) => b.price - a.price);

  const averageSellPrice =
    sellOrders.length > 0
      ? sellOrders.reduce((sum, order) => sum + order.price, 0) /
        sellOrders.length
      : null;

  const averageBuyPrice =
    buyOrders.length > 0
      ? buyOrders.reduce((sum, order) => sum + order.price, 0) /
        buyOrders.length
      : null;

  const midPrice =
    averageSellPrice !== null && averageBuyPrice !== null
      ? (averageSellPrice + averageBuyPrice) / 2
      : null;
  res.json({ sellOrders, buyOrders, midPrice });
});

function matchOrders(order, db) {
  const oppositeSide = order.side === "BUY" ? "SELL" : "BUY";

  order.remaining = Number(order.remaining ?? order.quantity);

  const candidates = db
    .get("orders")
    .filter(
      (o) =>
        o.id !== order.id &&
        o.instrument === order.instrument &&
        o.side === oppositeSide &&
        ["OPEN", "PARTIAL"].includes(o.status),
    )
    .value();

  for (let candidate of candidates) {
    if (order.remaining === 0) break;

    candidate.remaining = Number(candidate.remaining ?? candidate.quantity);

    const isMatch =
      (order.side === "BUY" && order.price >= candidate.price) ||
      (order.side === "SELL" && order.price <= candidate.price);

    if (!isMatch) continue;

    const tradedQty = Math.min(order.remaining, candidate.remaining);

    order.remaining -= tradedQty;
    candidate.remaining -= tradedQty;

    if (order.remaining === 0) {
      order.status = "EXECUTED";
    } else if (order.remaining < order.quantity) {
      order.status = "PARTIAL";
    }

    if (candidate.remaining === 0) {
      candidate.status = "EXECUTED";
    } else if (candidate.remaining < candidate.quantity) {
      candidate.status = "PARTIAL";
    }

    db.write();

    addHistory(db, order, tradedQty);
    addHistory(db, candidate, tradedQty);
  }
}

function addHistory(db, order, tradedQty) {
  db.get("history")
    .push({
      id: uuidv4(),
      orderId: order.id,
      side: order.side,
      status: order.status,
      tradedQuantity: tradedQty,
      remaining: order.remaining,
      price: order.price,
      timestamp: new Date().toISOString(),
    })
    .write();
}

server.use(router);

server.listen(3001, () => {
  console.log("JSON Server rodando na porta 3001");
});
