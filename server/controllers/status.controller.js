const pool = require('../middleware/database')

module.exports.loadStatuses = async (req, res) => {
  const query = 'SELECT id, `status`, color, icon  FROM `exp-statuses` ORDER BY `status`'

  await pool.promise().execute(query)
  .then(async ([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}
