import  {jsonServer} from 'json-server'
import {v4 as uuidv4} from 'uuid'

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

// 🔥 CRIAR ORDEM
server.post('/orders', (req, res) => {
  const db = router.db

  const newOrder = {
    id: uuidv4(),
    instrument: req.body.instrument,
    side: req.body.side, // BUY ou SELL
    price: Number(req.body.price),
    quantity: Number(req.body.quantity),
    remaining: Number(req.body.quantity),
    status: 'OPEN',
    createdAt: new Date().toISOString()
  }

  db.get('orders').push(newOrder).write()

  // 💥 TENTA EXECUTAR ORDEM
  matchOrders(newOrder, db)

  res.status(201).json(newOrder)
})

// ❌ CANCELAR ORDEM
server.patch('/orders/:id/cancel', (req, res) => {
  const db = router.db
  const order = db.get('orders').find({ id: req.params.id }).value()

  if (!order) {
    return res.status(404).json({ error: 'Ordem não encontrada' })
  }

  if (!['OPEN', 'PARTIAL'].includes(order.status)) {
    return res.status(400).json({ error: 'Ordem não pode ser cancelada' })
  }

  order.status = 'CANCELLED'
  db.write()

  addHistory(db, order.id, 'CANCELLED')

  res.json(order)
})

// 🧠 MATCH ENGINE (DIFERENCIAL DO TESTE)
function matchOrders(order, db) {
  const oppositeSide = order.side === 'BUY' ? 'SELL' : 'BUY'

  const candidates = db.get('orders')
    .filter(o =>
      o.instrument === order.instrument &&
      o.side === oppositeSide &&
      ['OPEN', 'PARTIAL'].includes(o.status)
    )
    .value()

  for (let candidate of candidates) {
    if (order.remaining === 0) break

    const isMatch =
      (order.side === 'BUY' && order.price >= candidate.price) ||
      (order.side === 'SELL' && order.price <= candidate.price)

    if (!isMatch) continue

    const tradedQty = Math.min(order.remaining, candidate.remaining)

    order.remaining -= tradedQty
    candidate.remaining -= tradedQty

    // Atualiza status
    updateStatus(order)
    updateStatus(candidate)

    db.write()

    addHistory(db, order.id, 'MATCHED')
    addHistory(db, candidate.id, 'MATCHED')
  }
}

// 🔄 STATUS
function updateStatus(order) {
  if (order.remaining === 0) {
    order.status = 'EXECUTED'
  } else if (order.remaining < order.quantity) {
    order.status = 'PARTIAL'
  }
}

// 🧾 HISTÓRICO
function addHistory(db, orderId, status) {
  db.get('history').push({
    id: uuidv4(),
    orderId,
    status,
    timestamp: new Date().toISOString()
  }).write()
}

server.use(router)
server.listen(3001, () => {
  console.log('JSON Server rodando na porta 3001')
})