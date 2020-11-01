const pool = require('../middleware/database')

module.exports.loadRoutes = async (req, res) => {
  const query = 'SELECT r.id, r.courier_id, o.id order_id, s.id status_id,\n' +
    'IFNULL(r.route, \'\') route, IFNULL(o.order, \'\') `order`,\n' +
    'IFNULL(o.date, \'\') `date`, IFNULL(o.city, \'\') city, IFNULL(o.address, \'\') address,' +
    'IFNULL(o.comment, \'\') comment,\n' +
    'IFNULL(s.status, \'\') `status`, IFNULL(s.color, \'\') `color`, IFNULL(s.icon, \'\') `icon`\n' +
    'FROM `exp-couriers` c\n' +
    'INNER JOIN `exp-routes` r ON r.courier_id = c.id\n' +
    'INNER JOIN `exp-orders` o ON o.route_id = r.id\n' +
    'INNER JOIN `exp-statuses` s ON s.id = o.status_id\n' +
    'WHERE DATE(o.date) > DATE_SUB(CURDATE(), INTERVAL 2 MONTH)\n' +
    'AND c.id = ?' + (req.query.status ? ' AND s.status = ?' : '') + '\n' +
    'ORDER BY route, `date`'

  const values = req.query.status
    ? [req.query.idCourier, req.query.status]
    : [req.query.idCourier]

  await pool.promise().execute(query, values)
  .then(async ([rows, fields]) => {
    res.json({routes: rows})
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.updateStatus = async (req, res) => {
  const query = 'UPDATE `exp-orders` SET status_id = ?, comment = ? WHERE id = ?'

  await pool.promise().execute(query, [
    req.query.status_id,
    req.query.comment,
    req.query.id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при обновлении статуса в таблице exp-orders'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}
