const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const pool = require('../middleware/database');

module.exports.add = async (req, res) => {
  const family = req.query.family;
  const name = req.query.name;
  let courier = null;
  let query = 'INSERT `exp-couriers`(`family`, `name`, `password`) VALUES(?, ?, ?)';

  await bcrypt.genSalt(10, async function (err, salt) {
    await bcrypt.hash(req.query.password, salt, async function (err, hash) {
      console.log('query:', query)
      await pool.promise().execute(query, [family, name, hash])
      .then(async (result) => {
        await res.json(`Курьер "${name} ${family}" добавлен`)
      })
      .catch((e) => {
        res.json({error: e.message})
      })
    });
  });
}

module.exports.login = async (req, res) => {
  const error = 'Курьер с такими логином и паролем отсутствует';

  const login = req.query.login.split(' ')

  if (login.length < 2) {
    res.json({error})
    return
  }

  const password = req.query.password

  let query = 'SELECT `id`, `family`, `name`, `password` FROM `exp-couriers` WHERE `family` = ? AND `name` = ?'

  await pool.promise().execute(query, [login[1], login[0]])
  .then(([rows, fields]) => {
    const courier = rows[0]

    if (courier) {
      bcrypt.compare(password, courier.password, async function (err, result) {
        if (err) {
          await res.json(err)
        } else if (!!result) {
          const token = jwt.sign({
              family: courier.family,
              name: courier.name,
              id: courier.id
            },
            'kmv-express',
            {expiresIn: 60 * 60 * 12} // 12 часов будет "жить" токен
          );

          await res.json({courier: courier, token: token})
        } else {
          await res.json({error})
        }
      })
    } else {
      res.json({error})
    }
  })
}

module.exports.getCourier = async (req, res) => {
  const query = 'SELECT `id`, `family`, `name` FROM `exp-couriers` WHERE `id` = ?'

  await pool.promise().execute(query, [req.query.id])
  .then(([rows, fields]) => {
    if (rows[0]) {
      res.json(rows[0])
    } else {
      res.json({error: `Курьер (id ${req.query.id}) отсутствует`})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}
