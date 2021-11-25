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
        this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk')
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
          title:{
            text:'▎商家销售统计',
            textStyle:{
              fontSize:66
            },
            left:20,
            top:20
          },
          grid:{//这个是配置坐标轴的位置，且不包括坐标轴的文字
            top:'20%',
            left:'3%',
            right:'6%',
            bottom:'3%',
            containLabel: true//距离是包括了坐标轴的文字
          },
          xAxis: {
            type:'value'
          },
          yAxis: {
            type: 'category',
            data: sellerNames
          },
          tooltip:{
            trigger:'axis',
            axisPointer:{
              type:'line',
              z:0,
              lineStyle:{
                width:66,
                color:'#2D3443'
              }
            }
          },
          series:[
            {
              type: 'bar',
              data: sellerValues,
              barWidth: 66,
              label:{
                show: true,
                position: 'right',
                textStyle:{
                  color:'white'
                }
              },
              itemStyle:{
                barBorderRadius: [0, 33, 33, 0],
                // 指明颜色渐变的方向
                // 之命名不同百分比至下的颜色的值
                // x1, y1, x2, y2   
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0,[
                  {//这个是0%状态下的颜色值
                    offset:0,
                    color:'#5052EE'
                  },
                  {//这个是100%状态下的颜色值
                    offset:1,
                    color:'#AB6EE5'
                  }
                ])
              }
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