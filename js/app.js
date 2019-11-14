(function (Vue) {
	const STORAGE_KEY = "items-vuejs"
	const itemStorage = {
		//获取函数
		fetch: function(){
			//获取出来的是json字符串
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
		},
		//保存数据
		save: function(items){
			localStorage.setItem(STORAGE_KEY,JSON.stringify(items))
		}
	}
	const items = [
		{
			id:1,
			content:"vue.js",
			completed:false
		},
		{
			id:2,
			content:"java",
			completed:false
		},
		{
			id:3,
			content:"python",
			completed:false
		}
	]

	//自定义全局指令
	Vue.directive("app-focus",{
		inserted(el,binding){
			el.focus()
		},
		update(el,binding){
			if(binding.value){
				el.focus()
			}
		}
	});
	var app = new Vue({
		el:'#todoapp',
		data:{
			items: itemStorage.fetch(),
			currentItem: null,
			filterStatus:"all" //接收变化的状态值
		},
		//定义计算属性
		computed:{
			filterItems(){
				switch (this.filterStatus) {
					case "active":
						return this.items.filter(item => !item.completed)
						break;
					case "completed":
						return this.items.filter(item => item.completed)
					default:
						return this.items
						break;
				}
			},
			toggleAll:{
				//当任务列表中的状态发生变化后，就更新复选框的状态
				get(){
					return this.remaining === 0
				},
				//复选框的改变，更新每个任务列表的状态
				set(newStatus){
					this.items.forEach(function(item){
						item.completed = newStatus;
					});
				}
			},
			remaining(){
				const unItmes = this.items.filter(function(item){
					return !item.completed
				})
				return unItmes.length
			}
		},
		//定义监听器
		watch:{
			//当对象中的某个属性发生改变之后，默认情况下不会被监听到
			//如果你希望修改对象属性之后，需要被监听到
			//item:function(newValue,old){

			//}
			items:{
				deep: true,
				//深度监听
				handler: function(newItems, oldItems,){
					//将数据保存到本地localStorage
					itemStorage.save(newItems)
				}
			}
		},
		//定义函数
		methods:{
			finishEdit(item, index, event){
				//1.获取当前输入框的值
				const content = event.target.value.trim();
				//2.判断输入框值是否为空
				if(!content){
					this.removeItem(index)
					return
				}
				//3.如果不为空，则添加到原有任务项
				item.content = content;
				//4.移除.editing样式
				this.currentItem = null
			},
			//进入编辑状态
			toEdit(item){
				this.currentItem = item
			},
			removeCompleted(){
				//过滤未完成数据,重新将新数组（未完成）赋值给items
				this.items = this.items.filter(item =>!item.completed)

			},
			//ES6语法
			addItem(e){
				console.log(e.target.value);
				//1.获取内容 
				const content = e.target.value.trim();
				//2.判断是否为空
				if(!content.length){
					return
				}
				//3.push到数组
				const id = this.items.length+1
				this.items.push(
					{
						id,
						content,
						completed:false
					}
				)
				//4.清空文本输入框内容
				e.target.value=''
			},
			removeItem(index){
				this.items.splice(index,1);
				console.log(index);
			},
			//取消编辑
			cancelEdit(){
				this.currentItem = null
			}
		}
	})
	
	//要写在Vue实例外面
	//当路由hash值发生变化之后，会自动调用该函数
	window.onhashchange = function (){
		console.log(window.location.hash)
		const hash = window.location.hash.substr(2) || 'all'
		app.filterStatus = hash
	}

	window.onhashchange();
})(Vue);
