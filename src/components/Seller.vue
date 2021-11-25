<!-- 商家销量同级的横向柱状图 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
  export default {
    name:'Seller',
    data(){
      return{
        chartInstance: null,
        allData:null,// 服务其返回的数据
        currentPage:1, //当前显示的页数
        totalPage:0,//一共多少页
        timerId: null// 定时器的标识
      }
    },
    mounted(){
      this.getData()
      this.initChart()
    },
    beforeDestroy(){
      clearInterval(this.timerId)
    },
    methods:{
      // 初始化echarts
      initChart(){
        this.chartInstance = this.$echarts.init(this.$refs.seller_ref)
        // 对图标对象进行鼠标事件的监听
        this.chartInstance.on('mouseover', ()=>{
          clearInterval(this.timerId)
        })
        this.chartInstance.on('mouseout', ()=>{
          this.startInterval()
        })
      },
      // 获取服务器的数据
      async getData(){
        const res = await this.$http.get('seller')
        let {data} = res
        console.log(data)
        this.allData = data
        // 对数据进行排序的操作
        this.allData.sort((a, b) => {
          return a.value - b.value //从小到大排序
        })
        // 每5个元素显示一页
        this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
        this.updateChart()
        // 启动定时器  每隔三秒实现数据变化
        this.startInterval()
      },
      // 更新图表
      updateChart(){
        const start = (this.currentPage - 1) * 5
        const end = this.currentPage * 5
        const showData = this.allData.slice(start, end)
        const sellerNames = showData.map((item)=>{
          return item.name
        })
        const sellerValues = showData.map((item) =>{
          return item.value
        })
        const option = {
          xAxis: {
            type:'value'
          },
          yAxis: {
            type: 'category',
            data: sellerNames
          },
          series:[
            {
              type: 'bar',
              data: sellerValues
            }
          ]
        }
        this.chartInstance.setOption(option)
      },
      startInterval (){
        // 在开启定时器之前要先判断定时器是否存在，清了后再开启
        if(this.timerId){
          clearInterval(this.timerId)
        }
        this.timerId = setInterval(()=>{
          this.currentPage++
          if(this.currentPage > this.totalPage){
            this.currentPage = 1
          }
          this.updateChart()
        }, 3000)
      }

    }
  }
</script>

<style lang="less" scoped>
  
</style>