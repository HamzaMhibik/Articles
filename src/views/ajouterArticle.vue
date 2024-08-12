<template>
  <div class="bodyy">
    <div class="page1">
      <form @submit.prevent="signUp()">
        <center>
          <legend>Ajouter Article</legend>
        </center>
        <div class="input-row">
          <div class="input-group">
            <label required>Nomenclature</label><br>
            <div class="input-group3">
              <input type="number" v-model="Nomenclature" class="form-control" placeholder="Nomenclature" required>
            </div>
          </div>
        </div><br>
        <div class="input-row">
          <div class="input-group">
            <label>Magasin</label>
            <input type="text" v-model="Magasin" required placeholder="Magasin">
          </div>
        </div><br>
        <div class="input-row">
          <div class="input-group">
            <label>Description</label>
            <input type="text" v-model="Description" required placeholder="Description">
          </div>
        </div><br>
        <div class="input-row">
          <div class="input-group">
            <label>Capacite</label>
            <input type="text" v-model="Capacite" required placeholder="Capacite">
          </div>
        </div><br>
        <div class="input-row">
          <div class="input-group">
            <input type="radio" id="neuf" value="neuf" v-model="Etat" />
            <label for="neuf" style="margin-right: 50px;">Neuf</label>
            <input type="radio" id="avarie" value="avarie" v-model="Etat" />
            <label for="avarie">Avarie</label>
          </div>
        </div><br>
        <div class="input-row">
          <div class="input-group">
            <label for="image_joueur">Image Article :</label>
            <input type="file" ref="myfiles" id="image_joueur" accept=".png,.jpg" @change="handleImageChange" multiple
              required>
          </div>
        </div>
        <br>
        <center><input type="submit" value="Enregistre article"></center>
      </form>
    </div>
  </div>
</template>


<script>
import { db, storage } from "../firebase/firebase";
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes } from "firebase/storage";

export default {
  data() {
    return {
      Nomenclature: '',
      Magasin: '',
      Description: '',
      Capacite: '',
      Etat: '',
      files: [],  // Ajoutez cette ligne pour stocker les fichiers sélectionnés
    }
  },
  methods: {
    handleImageChange(event) {
      this.files = event.target.files;  // Stockez les fichiers sélectionnés
    },
    async signUp() {
      try {
        const article = await addDoc(collection(db, "Articles"), {
          Nomenclature: this.Nomenclature,
          Magasin: this.Magasin,
          Description: this.Description,
          Capacite: this.Capacite,
          Etat: this.Etat,
        });
        const imagesRef1 = ref(storage, `Articles/${this.Nomenclature}/`);
        for (let i = 0; i < this.files.length; i++) {
          const file = this.files[i];
          const storageRef = ref(imagesRef1, `photo_${i}`);  // Utilisez un nom unique pour chaque fichier
          await uploadBytes(storageRef, file);
        }
        this.$router.push('/')
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    },
  }
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  list-style: none;
  font-family: "poppins";
}


label {
  color: black;
  font-size: 1.1rem;
  font-weight: bold;
}

input[type='tel'],
input[type="text"],
input[type="email"],
input[type="number"],
input[type="password"],
select {
  font-size: 1.1rem;
  line-height: 1.25rem;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid rgba(55, 65, 81, 1);
  outline: 0;
  padding: 0.75rem 1rem;
  color: rgb(0, 0, 0);
}

h3 {
  font-size: 2rem;
  margin-top: 20px;
  color: #01adb6;
  font-weight: 600;
  font-family: "poppins" bold;
}

legend {
  font-size: 2rem;
  color: #01adb6;
  font-weight: 600;
  font-family: "poppins" bold;
}

input[type='submit'] {
  display: block;
  width: 50%;
  background: #007E85;
  padding: 0.75rem;
  text-align: center;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: .3s;
  cursor: pointer;
}

input[type='submit']:focus {
  background: #00686f;
}

.input-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}


.input-group {
  flex: 1;
}

.error-message {
  color: red;
}

input::-webkit-input-placeholder {
  color: #a8a8a8;
}

.bodyy {
  color: white;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}


@media screen and (max-width: 768px) {
  .input-group {
    flex-basis: 100%;
  }

  .input-row2 {
    width: 100%;
  }

  .page1 {
    width: 95%;
    border: none;
    padding: 0;
    display: flex;
    justify-content: center;
    border-radius: 0.5rem;
  }

  form {
    width: 90%;
  }
}
</style>