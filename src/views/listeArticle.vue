<template>
  <div class="container">
    <div class="filter-section">
      <h3>Liste des Articles</h3>
      <div class="filter-options">
        <select v-model="selectedMagasin" @change="filterArticles">
          <option value="">Tous les magasins</option>
          <option v-for="magasin in magasins" :value="magasin">{{ magasin }}</option>
        </select>
        <br>
        <input type="text" v-model="searchQuery" placeholder="Rechercher par nomenclature">
      </div>
    </div>
    <div v-for="article in filteredArticles" :key="article.id" class="article-item">
      <div class="article-info">
        <p><strong>Nomenclature:</strong> {{ article.Nomenclature }}</p>
        <p><strong>Magasin:</strong> {{ article.Magasin }}</p>
        <p class="desc"><strong>Description:</strong> {{ article.Description }}</p>
        <p><strong>Capacite:</strong> {{ article.Capacite }}</p>
        <p><strong>Etat:</strong> {{ article.Etat }}</p>
      </div>
      <div class="article-image">
        <img :src="article.imageUrls[0]" alt="Image de l'article" v-if="article.imageUrls.length > 0" />
      </div><br>
      <button @click="modifier(article.id)" class="button modifier-button">Modifier</button>
      <br>
      <button @click="supprimerArticle(article.id)" class="button supprimer-button">Supprimer</button>
      <br>
      <button @click="Voir(article.id)" class="button Voir-button">Voir</button>
    </div>
    <div v-if="filteredArticles.length === 0" class="no-results">
      Aucun résultat trouvé.
    </div>
  </div>
</template>

<script>
import { db, storage } from "../firebase/firebase";
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      articles: [],
      magasins: [],
      selectedMagasin: '',
      searchQuery: '',
      errorMessage: '',
    }
  },
  async created() {
    const querySnapshot = await getDocs(collection(db, "Articles"));
    const articles = [];
    const magasins = new Set();
    for (let doc of querySnapshot.docs) {
      const articleData = doc.data();
      const imagesRef = ref(storage, `Articles/${articleData.Nomenclature}/`);
      const imageUrls = await listAll(imagesRef).then(async (result) => {
        const urlPromises = result.items.map((imageRef) => getDownloadURL(imageRef));
        return Promise.all(urlPromises);
      }).catch(() => []);

      articles.push({
        id: doc.id,
        ...articleData,
        imageUrls
      });
      magasins.add(articleData.Magasin);
    }
    this.articles = articles;
    this.magasins = Array.from(magasins);
  },
  computed: {
    filteredArticles() {
      let filteredByMagasin = this.articles;
      if (this.selectedMagasin) {
        filteredByMagasin = this.articles.filter(article => article.Magasin === this.selectedMagasin);
      }

      if (!this.searchQuery) {
        return filteredByMagasin;
      } else {
        const searchRegex = new RegExp(this.searchQuery.trim(), 'i');
        return filteredByMagasin.filter(article => searchRegex.test(article.Nomenclature));
      }
    }
  },
  methods: {
    filterArticles() {
      this.filteredArticles;
    },
    modifier(idarticle) {
      this.$router.push({ path: '/modifier', query: { id: idarticle } });
    },
    Voir(idarticle) {
      this.$router.push({ path: '/Article', query: { id: idarticle } });
    },
    async supprimerArticle(idArticle) {
      await Swal.fire({
        title: "Supprimer cet article?",
        showDenyButton: true,
        confirmButtonText: "Oui",
        denyButtonText: "Non",
        input: "password",
        inputPlaceholder: "Enter your password",
        preConfirm: (password) => {
          if (password === "article") {
            return true;
          } else {
            Swal.showValidationMessage("Invalid password");
            return false;
          }
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // Supprimer l'article de la base de données
            await deleteDoc(doc(db, "Articles", idArticle));

            // Supprimer les images associées à l'article
            const article = this.articles.find(article => article.id === idArticle);
            if (article && article.imageUrls.length > 0) {
              for (let imageUrl of article.imageUrls) {
                const imageRef = ref(storage, imageUrl);
                await deleteObject(imageRef);
              }
            }

            // Mettre à jour la liste des articles après la suppression
            this.articles = this.articles.filter(article => article.id !== idArticle);
          } catch (error) {
            console.error("Erreur lors de la suppression de l'article :", error);
            this.errorMessage = "Une erreur s'est produite lors de la suppression de l'article.";
          }
        } else if (result.isDenied) {
        }
      });
    }
  }
}
</script>

<style scoped>
.container {
  background-color: #b8b5b5;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.filter-section {
  margin-bottom: 20px;
  width: 100%;
  padding-bottom: 20px
}

.filter-options {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.filter-options select {
  font-size: 1.1rem;
  width: 95%;
  height: 50px;
  margin-right: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.filter-options input {
  font-size: 1.1rem;
  width: 92%;
  height: 40px;
  margin-right: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.article-list {
  background-color: white;
  width: 95%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
}

.desc {
  display: flex;
  flex-wrap: wrap;
}

.article-item {
  background-color: white;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}

.article-info {
  flex: 1;
}

.article-info p {
  font-size: 1.25rem;
}

.article-image {
  display: flex;
  justify-content: center;
}

.article-image img {
  max-width: 300px;
  max-height: 800px;
  display: block;
}

.no-results {
  text-align: center;
  color: #666;
}

h3 {
  text-align: center;
  font-size: 2rem;
  color: #029097;
  font-weight: 600;
  font-family: "poppins" bold;
}

.button {
  width: 200px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #01adb6;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #007a7e;
}

.supprimer-button {
  background-color: #ff0000;
}

.supprimer-button:hover {
  background-color: #6b0000;
}
.Voir-button{
  background-color: #02b34c;
}

.Voir-button:hover{
  background-color: #025f29;
}

@media only screen and (max-width: 600px) {
  .article-list {
    flex-direction: column;
    gap: 20px;
  }

  .filter-options select {
    width: 84%;
  }

  .filter-options input {
    width: 80%;
  }
}
</style>