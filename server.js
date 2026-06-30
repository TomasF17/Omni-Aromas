const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors()); // Permite que o teu HTML comunique com o servidor

// 1. Ligação ao MongoDB (Substitui pela tua string de conexão do MongoDB Atlas ou Local)
const MONGO_URI = "mongodb+srv://tomasfferreira04_db_user:WBjQbvqg8e5IzPCS@omni-aromasdb.3nfl9pm.mongodb.net/?appName=Omni-AromasDB"; 
mongoose.connect(MONGO_URI)
  .then(() => console.log("Ligado com sucesso ao MongoDB!"))
  .catch(err => console.error("Erro ao ligar ao MongoDB:", err));

// 2. Definição do Modelo de Utilizador (Schema)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// 3. Rota de REGISTO
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar se o email já existe
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "Este email já está registado." });

    // Encriptar a palavra-passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar no MongoDB
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Utilizador registado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao processar o registo." });
  }
});

// 4. Rota de LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Procurar o utilizador pelo email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Utilizador ou palavra-passe incorretos." });

    // Comparar a palavra-passe digitada com a encriptada na BD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Utilizador ou palavra-passe incorretos." });

    // Login com sucesso
    res.status(200).json({ message: "Login efetuado com sucesso!", username: user.username });
  } catch (err) {
    res.status(500).json({ error: "Erro ao processar o login." });
  }
});

// Iniciar o servidor na porta 5000
app.listen(5000, () => console.log("Servidor API a correr na porta 5000"));