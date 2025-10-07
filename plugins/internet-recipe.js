import axios from 'axios'

let handler = async (m, { conn, text, command, usedPrefix }) => {
    if (!text) return m.reply(`Gunakan format ${usedPrefix + command} <query>\n\n*Contoh :* ${usedPrefix + command} ayam kecap`);

    m.reply('⏳ Mohon tunggu, sedang mencari resep...');

    try {
        let response = await axios.get(`${APIs.ammaricano}/api/search/cookpad?query=${encodeURIComponent(text)}`);
        let data = response.data;

        if (!data.result || !data.result.length) {
            return m.reply('❌ Resep tidak ditemukan!');
        }

        // Ambil resep secara acak dari hasil pencarian
        let resep = data.result[Math.floor(Math.random() * 5)];

        // Pastikan ingredients adalah array satu dimensi
        let ingredients = Array.isArray(resep.ingredients)
            ? (Array.isArray(resep.ingredients[0]) ? resep.ingredients[0] : resep.ingredients)
            : [];

        let caption = `🍽️ *${resep.title}*\n\n👨‍🍳 *Penulis:* ${resep.author}\n⏱️ *Waktu:* ${resep.prepTime}\n🍴 *Porsi:* ${resep.servings}\n\n📝 *Bahan-bahan:*\n${ingredients.map((b, i) => `  ${i + 1}. ${b}`).join('\n')}\n\n🔗 *Link Resep:* ${resep.url}`;

        await conn.sendMessage(m.chat, {
            image: { url: resep.imageUrl },
            caption: caption
        }, { quoted: m });

    } catch (err) {
        console.error(err);
        m.reply('❌ Terjadi kesalahan saat mengambil resep!');
    }
};

handler.help = ['recipe'].map(v => v + ' <query>');
handler.tags = ['internet'];
handler.command = /^(recipe|recipes|cookpad)$/i;

handler.limit = 1
handler.register = true

export default handler
