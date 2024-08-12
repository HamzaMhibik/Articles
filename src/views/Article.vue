<template>
    <div class="container">
        <h3>Voir l'article</h3>
        <form class="article-form">
            <div class="form-group">
                <label for="nomenclature">Nomenclature:</label>
                <input type="text" id="nomenclature" v-model="article.Nomenclature" required class="form-control"
                    disabled>
            </div>
            <div class="form-group">
                <label for="magasin">Magasin:</label>
                <input type="text" id="magasin" v-model="article.Magasin" required class="form-control" disabled>
            </div>
            <div class="form-group">
                <label for="description">Description:</label>
                <textarea id="description" v-model="article.Description" required class="form-control"
                    disabled></textarea>
            </div>
            <div class="form-group">
                <label for="capacite">Capacité:</label>
                <input type="text" id="capacite" v-model="article.Capacite" required class="form-control" disabled>
            </div>
            <div class="form-group">
                <label for="etat">État:</label>
                <input type="text" id="etat" v-model="article.Etat" required class="form-control" disabled>
            </div>
            <label for="images">Images:</label>
            <div v-if="article.imageUrls && article.imageUrls.length > 0" class="image-container">
                <div v-for="(imageUrl, index) in article.imageUrls" :key="index" class="article-image">
                    <img :src="imageUrl" alt="Image de l'article" style="max-width: 300px; max-height: 400px;"
                        @click="Image(imageUrl)">
                </div>
            </div>
            <div v-else>
                <p>Aucune image disponible.</p>
            </div>
        </form>
    </div>
</template>

<script>
import { db, storage } from "../firebase/firebase";
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL, listAll } from "firebase/storage";
import Swal from "sweetalert2";

export default {
    data() {
        return {
            article: {
                id: '',
                Nomenclature: '',
                Magasin: '',
                Description: '',
                Capacite: '',
                Etat: '',
                imageUrls: []  // Store image URLs in an array
            }
        };
    },
    async created() {
        const articleId = this.$route.query.id;
        try {
            const articleDoc = await getDoc(doc(db, "Articles", articleId));
            if (articleDoc.exists()) {
                const articleData = articleDoc.data();
                const imageUrls = await this.getArticleImages(articleData.Nomenclature);
                this.article = {
                    id: articleDoc.id,
                    imageUrls,
                    ...articleData
                };
            } else {
                console.log("Cet article n'existe pas.");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'article :", error);
        }
    },
    methods: {
        async getArticleImages(nomenclature) {
            try {
                const imagesRef = ref(storage, `Articles/${nomenclature}`);
                const listResult = await listAll(imagesRef);
                const imageUrls = await Promise.all(listResult.items.map(async (itemRef) => {
                    return await getDownloadURL(itemRef);
                }));
                return imageUrls;
            } catch (error) {
                console.error("Erreur lors de la récupération des images de l'article :", error);
                return [];
            }
        },
        Image(imageUrl) {
            Swal.fire({
                imageUrl,
                imageAlt: 'Image de l\'article',
                customClass: {
                    image: 'custom-image-style'  // Ajoutez une classe CSS personnalisée pour ajuster la taille de l'image
                },
                showCloseButton: true,
                showConfirmButton: false,
                focusConfirm: false
            });
        }
    }
};
</script>

<style scoped>
.custom-image-style {
    width: 600px;
    height: 800px;
}
</style>


<style scoped>
.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

h3 {
    margin-bottom: 20px;
    text-align: center;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    font-weight: bold;
}

input,
textarea {
    max-width: 90%;
    font-size: 1.2rem;
}

textarea {
    min-height: 70px;
    font-size: 1rem;
}

.form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.btn {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn:hover {
    background-color: #0056b3;
}

h3 {
    font-size: 1.5rem;
    color: #01adb6;
    font-weight: 600;
    font-family: "poppins" bold;
}

.image-container {
    border: solid 2px black;
    padding: 5px;
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.article-image {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    padding: 10px 0px;
    background-color: #ccc;
    width: 95%;
}

.article-image img {
    text-align: center;
}
</style>