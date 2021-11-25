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
        allData:null
      }
    },
    mounted(){
      this.getData()
      this.initChart()
      
    },
    methods:{
      // 初始化echarts
      initChart(){
        this.chartInstance = this.$echarts.init(this.$refs.seller_ref)
      },
      // 获取服务器的数据
      async getData(){
        const res = await this.$http.get('seller')
        let {data} = res
        console.log(data)
        this.allData = data
        this.updateChart()
      },
      // 更新图表
      updateChart(){
        const sellerNames = this.allData.map((item)=>{
          return item.name
        })
        const sellerValues = this.allData.map((item) =>{
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
      }

    }
  }
</script>

<style lang="less" scoped>
  
</style>