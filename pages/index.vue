<template>
  <div class="container">

      <div id="app">
        <h1 class="title">
          ホワイトボード 
        </h1>
 <button @click='post'>click me</button>
      <button type="button" class="btn btn-success btn-user-add"  v-on:click="newuser">新規登録</button>
      <form id="form" @submit.prevent="addItem">
        <ul class="list-group" v-if="apiResult.length">
          <li class="list-group-item justify-content-between" v-for="item in apiResult">
            <div class="form-row align-items-right">
              <ul class="col-auto user-schedule">
                <li class="item-user">{{item.user}} </li>
                <li class="item-schedule">
                  <div class="col-auto label-mod">
                    {{item.schedule}}
                  </div>                
                </li>
              </ul>

              <div class="col row-commands">
                <button type="button" class="btn btn-info btn-schedule-edit"  v-on:click="edit(item)">編集</button>
                <button type="submit" class="btn btn-danger btn-schedule-remove" aria-label="Close"  v-on:click="remove(item)">削除</button>
              </div>                
            </div>
          </li>
        </ul>
      </form>
      <!--固定エリア-->
      <div id="configuration-area" class="transparent">
        <button class="btn btn-default" id="configuration-area-close" v-on:click="hide">× 閉じる</button>
        <!--新規登録-->
        <div class="form-row align-items-center input-form hidden" id="add-schedule">
          <div class="col">
            <input type="text" class="form-control insert" v-model="user" placeholder="ユーザー名(※)" required>
          </div>            
          <div class="col-auto">
            <input type="text" class="form-control insert" v-model="insert" placeholder="予定">
          </div>
          <div class="col-auto">
            <button type="submit" class="btn btn-success btn-schedule-insert" v-on:click="add">登録する</button>
          </div>
        </div>
        <!--編集-->
        <div class="form-row align-items-left hidden input-form" id="edit-schedule">
          <div class="col">
            <input type="text" id="input-schedule" class="form-control update" v-model="update" >
          </div>
          <div class="col-auto">
            <button type="button" class="btn btn-info btn-schedule-update" 
             v-on:click="mod">更新する</button>
          </div>
        </div>
      </div>
      <!--固定エリア-->

      </div>
  </div>


</template><script>
import Logo from '~/components/Logo.vue'
import Methods from '~/server/api/methods'

export default {
  components: {
    Logo
  },
  asyncData(context) {
    return { apiResult: context.req.data };
  },
  data() {
    return {
      user: '',
      insert: '',
      update: '',
      items: [{
          user: '富士通太郎',
          schedule: 'テスト'
        }
      ]
    }
  },
  methods: {
    //サーバーから返ってくる値をログに出力したいのでasyncとawaitを行う
    async post() {
      let response = await Methods.testPosting()
      
    },
    hide: function (e) {
      document.getElementById('edit-schedule').classList.toggle('hidden');
      document.getElementById('add-schedule').classList.toggle('hidden');    
      document.getElementById('configuration-area').classList.toggle('transparent');
    },
    newuser: function (e) {
      document.getElementById('edit-schedule').classList.add('hidden');
      document.getElementById('add-schedule').classList.remove('hidden');    
      document.getElementById('configuration-area').classList.toggle('transparent');
    },
    add: function (e) {
      var form = document.getElementById('form');
      if (!form.checkValidity()) return;
      e.preventDefault();
      this.apiResult.push({
        user: this.user, 
        schedule: this.insert
      });
      this.user = '';
      this.insert = '';
    },
    edit: function (item) {
      var index = this.apiResult.indexOf(item);
      document.getElementById('edit-schedule').setAttribute('tag', index);
      document.getElementById('input-schedule').setAttribute('value', this.apiResult[index].schedule); 
      document.getElementById('add-schedule').classList.add('hidden');
      document.getElementById('edit-schedule').classList.remove('hidden');
      document.getElementById('configuration-area').classList.toggle('transparent');
    },
    mod: function (e) {
      var index = document.getElementById('edit-schedule').getAttribute('tag');
      this.apiResult[index].schedule = this.update;
      this.update = '';
      e.preventDefault();
    },
    remove: function (item) {
      if(!confirm(item.user+' を本当に削除しますか？')){
          return false;
      }        
      var index = this.apiResult.indexOf(item);
      this.apiResult.splice(index, 1);
      //axios.get('/api/apiResult').then(response => this.users = response.data);

    },
    // サーバーから返ってくる値をログに出力したいのでasyncとawaitを行う
    async post() {
      let response = await Methods.testPosting()
      console.log(response)
    }
  }
  
}


</script>
