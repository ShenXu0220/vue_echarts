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
      // 分辨率适配
      window.addEventListener('resize', this.screenAdapter)
      // 在页面加载完成之后，主动进行屏幕的适配
      this.screenAdapter()
    },
    beforeDestroy(){
      clearInterval(this.timerId)
      // 在组件销毁的时候，将监听器取消掉，防止内存泄漏
      window.removeEventListener('resize', this.screenAdapter)
    },
    methods:{
      // 初始化echarts
      initChart(){
        this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk')
        // 对图标初始化的控制
        const initOption = {
            title:{
              text:'▎商家销售统计',
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
            },
            tooltip:{
              trigger:'axis',
              axisPointer:{
                type:'line',
                z:0,
                lineStyle:{
                  color:'#2D3443'
                }
              }
            },
            series:[
              {
                type: 'bar',
                label:{
                  show: true,
                  position: 'right',
                  textStyle:{
                    color:'white'
                  }
                },
                itemStyle:{
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
        this.chartInstance.setOption(initOption)
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
        const dataOption = {
          yAxis: {
            data: sellerNames
          },
          series:[
            {
              data: sellerValues,
            }
          ]
        }
        this.chartInstance.setOption(dataOption)
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
      },
      // 当浏览器的大小发生变化时，会调用的方法，完成分辨率适配
      screenAdapter(){
        // this.$refs.seller_ref.offsetWidth
        const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
        // 和分辨率率相关的配置项
        const adapterOption = {
            title:{
              textStyle:{
                fontSize:titleFontSize
              },
            },
            tooltip:{
              axisPointer:{
                lineStyle:{
                  width: titleFontSize,
                }
              }
            },
            series:[
              {
                barWidth: titleFontSize,
                itemStyle:{
                  barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
                }
              }
          ]
        }
        this.chartInstance.setOption(adapterOption)
        // 手动调用图表对象的resize，才能产生效果
        this.chartInstance.resize()
      }
    }
  }
</script>

<style lang="less" scoped>
  
</style>