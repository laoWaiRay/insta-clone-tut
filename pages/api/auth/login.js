export default function handler(req, res) {
  // if (req.method === 'POST') {
  //   const { username, password } = req.body;
  //   console.log(username, password)
  //   res.status(200).json({ username, password })
  // }
  // else {
  //   res.status(400).json({})
  // }
  res.status(200).json({ username: bob, password: bobo })


}