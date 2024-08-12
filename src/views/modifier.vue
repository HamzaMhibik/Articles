<template>
    <div class="container">
        <h3>Modifier l'article</h3>
        <form @submit.prevent="modifierArticle" class="article-form">
            <div class="form-group">
                <label for="nomenclature">Nomenclature:</label>
                <input type="text" id="nomenclature" v-model="article.Nomenclature" required class="form-control" disabled>
            </div>
            <div class="form-group">
                <label for="magasin">Magasin:</label>
                <input type="text" id="magasin" v-model="article.Magasin" required class="form-control">
            </div>
            <div class="form-group">
                <label for="description">Description:</label>
                <textarea id="description" v-model="article.Description" required class="form-control"></textarea>
            </div>
            <div class="form-group">
                <label for="capacite">Capacité:</label>
                <input type="text" id="capacite" v-model="article.Capacite" required class="form-control">
            </div>
            <div class="form-group">
                <label for="etat">État:</label>
                <input type="text" id="etat" v-model="article.Etat" required class="form-control">
            </div>
            <div class="form-group">
                <label for="image">Image:</label>
                <input type="file" id="image" @change="onImageChange" accept="image/*" class="form-control">
            </div>
            <center>
                <button type="submit" class="btn btn-primary">Enregistrer les modifications</button>
            </center>
        </form>
    </div>
</template>

<script>
import { db, storage } from "../firebase/firebase";
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL, deleteObject, uploadBytes, file } from "firebase/storage";
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
                imageUrl: ''
            },
            oldNomenclature: ''
        };
    },
    async mounted() {
        this.password()
    },
    async created() {
        const articleId = this.$route.query.id;
        try {
            const articleDoc = await getDoc(doc(db, "Articles", articleId));
            if (articleDoc.exists()) {
                const articleData = articleDoc.data();
                const imageUrl = await getDownloadURL(ref(storage, `Articles/${articleData.Nomenclature}/photo`)).catch(() => null);
                this.article = {
                    id: articleDoc.id,
                    imageUrl,
                    ...articleData
                };
            } else {
                console.log("Cet article n'existe pas.");
            }
            this.oldNomenclature = this.article.Nomenclature
        } catch (error) {
            console.error("Erreur lors de la récupération de l'article :", error);
        }
    },
    methods: {
        async onImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                try {
                    const result = await Swal.fire({
                        title: "Changer l'image d'article",
                        showDenyButton: true,
                        confirmButtonText: "Oui",
                        denyButtonText: "Non"
                    });

                    if (result.isConfirmed) {
                        // Supprimer l'ancienne image si elle existe
                        if (this.article.imageUrl) {
                            const imageRef = ref(storage, `Articles/${this.article.Nomenclature}/photo`);
                            await deleteObject(imageRef);
                        }

                        // Télécharger la nouvelle image
                        const storageRef = ref(storage, `Articles/${this.article.Nomenclature}/photo`);
                        const snapshot = await uploadBytes(storageRef, file);
                        this.article.imageUrl = await getDownloadURL(snapshot.ref);

                        Swal.fire("Image changé", "", "success");
                    } else if (result.isDenied) {
                        // Action à effectuer si l'utilisateur a refusé
                    }
                } catch (error) {
                    console.error("Erreur lors du téléchargement de la nouvelle image :", error);
                }
            }
        },
        async modifierArticle() {
            try {
                const articleRef = doc(db, "Articles", this.article.id);
                if (this.oldNomenclature !== this.article.Nomenclature) {
                    const oldImageRef = ref(storage, `Articles/${this.oldNomenclature}/photo`);
                    const newImageRef = ref(storage, `Articles/${this.article.Nomenclature}/photo`);

                    // Récupérer l'URL de l'image actuelle
                    const imageUrl = await getDownloadURL(oldImageRef);

                    // Supprimer l'ancien dossier de l'image

                    // Télécharger la nouvelle image
                    const fileRef = ref(storage, `Articles/${this.article.Nomenclature}/photo`);
                    const snapshot = await uploadBytes(fileRef, file);
                    this.article.imageUrl = await getDownloadURL(snapshot.ref);

                    // Mettre à jour l'URL de l'image dans Firestore
                    await updateDoc(articleRef, {
                        Nomenclature: this.article.Nomenclature,
                        Magasin: this.article.Magasin,
                        Description: this.article.Description,
                        Capacite: this.article.Capacite,
                        Etat: this.article.Etat,
                        imageUrl: this.article.imageUrl
                    });
                    await deleteObject(oldImageRef);

                    Swal.fire("Article modifié avec succès.", "", "success");
                } else {
                    // Si la nomenclature n'a pas changé, mettre à jour les autres champs sauf imageUrl
                    await updateDoc(articleRef, {
                        Nomenclature: this.article.Nomenclature,
                        Magasin: this.article.Magasin,
                        Description: this.article.Description,
                        Capacite: this.article.Capacite,
                        Etat: this.article.Etat
                    });

                    Swal.fire("Article modifié avec succès.", "", "success");
                }

                console.log("Les modifications ont été enregistrées avec succès.");
                // Redirection ou message de confirmation
            } catch (error) {
                console.error("Une erreur s'est produite lors de l'enregistrement des modifications :", error);
                // Gestion d'erreur, message à l'utilisateur, etc.
            }
        },
        async password() {
            const { value: password } = await Swal.fire({
                title: "Enter your password",
                input: "password",
                inputLabel: "Password",
                inputPlaceholder: "Enter your password",
                inputAttributes: {
                    maxlength: "10",
                    autocapitalize: "off",
                    autocorrect: "off"
                }
            });
            if (password == 'article') {
            }
            else {
                this.password()
            }
        }
    }
};

</script>

<style scoped>
.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

h2 {
    margin-bottom: 20px;
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
</style>