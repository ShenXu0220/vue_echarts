<template>
 <div class="com-container">
   <div class="com-chart" ref="hot_ref"></div>
   <span class="iconfont arr-left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
   <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ed;</span>
   <span class="cat-name" :style="comStyle">{{catName}}</span>
  </div> 
</template>

<script>
  export default {
    name:'Seller',
    data(){
      return{
        // 第一步
        chartInstane: null,
        allData: null,//从服务器中获取到的所有的数据
        currentIndex: 0,//当前所展示的一级分类
        titleFontSize: 0
      }
    },
    computed:{
      catName(){
        if(!this.allData){
          return ''
        }else{
          return this.allData[this.currentIndex].name
        }
      },
      comStyle(){
        return{
          fontSize: this.titleFontSize + 'px'
        }
      }
    },
    // 第五步
    mounted(){
      this.initChart()//调用初始化 
      this.getData() //获取数据
      // 第六步
      // 分辨率的适配
      window.addEventListener('resize', this.screenAdapter)
      // 第八步
      // 主动触发各种尺寸的计算
      this.screenAdapter()
    },
    // 第七步
    // 有监听，就必须设置取消监听
    beforeDestroy(){
      window.removeEventListener('resize', this.screenAdapter)
    },
    methods:{
      // 第二步
      // 初始化echarts实例对象的方法
      initChart(){
        this.chartInstane = this.$echarts.init(this.$refs.hot_ref,'chalk')//在dom元素上初始化
        const initOption = {
          title:{
            text:'▎热销商品的占比',
            left: 20,
            top: 20
          },
          legend:{
            top: '15%',
            icon: 'circle'
          },
          tooltip:{
            show: true,
            formatter: (arg) =>{
              // console.log(arg)
              const thirdCategory = arg.data.children
              // 计算出所有三级分类的数值总和
              let total = 0
              thirdCategory.forEach(item =>{
                total += item.value
              })
              let retStr = ''
              thirdCategory.forEach(item =>{
                retStr += `
                  ${item.name}:${parseInt(item.value / total * 100) + '%'}
                  <br/>
                `
              })
              return retStr
            }
          },
          series:[
            {
              type: 'pie',
              label:{
                show:false
              },
              // 当饼图高亮时的显示文字
              emphasis:{
                label:{
                  show: true
                },
                labelLine:{
                  show: false
                }
              }
            }
          ]
        }
        this.chartInstane.setOption(initOption)
      },
      // 第三步
      // 获取服务器数据的方法
      async getData(){
        let {data: ret} = await this.$http.get('hotproduct')
        this.allData = ret
        // console.log(this.allData)
        this.updateChart()
      },
      // 第四步
      updateChart(){
        // 用于处理数据
        // 一级分类中的二级分类遍历
        const legendData = this.allData[this.currentIndex].children.map(item =>{
          return item.name
        })
        const seriesData = this.allData[this.currentIndex].children.map(item =>{
          return {
            name: item.name,
            value: item.value,
            children: item.children//为了在tooltip中formatter得到三级分类的数据
          }
        })
        const dataOption = {
          legend: {
            data: legendData
          },
          series: [
            {
              data: seriesData
            }
          ]
        }
        this.chartInstane.setOption(dataOption)//和数据相关的配置项
      },
      // 第六步
      screenAdapter(){
        this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
        const adapterOption = {
          title:{
            textStyle:{
              fontSize: this.titleFontSize
            }
          },
          legend:{
            itemWidth: this.titleFontSize / 2,
            itemHeight: this.titleFontSize / 2,
            itemGap: this.titleFontSize / 2,
            textStyle:{
              fontSize: this.titleFontSize / 2
            }
          },
          series:[
            {
              radius: this.titleFontSize * 4.5,
              center: ['50%', '60%']//饼图的位置
            }
          ]
        }
        this.chartInstane.setOption(adapterOption)//关于所有屏幕分辨率相关的配置项
        this.chartInstane.resize()//用于图表自适应
      },
      // 左点击
      toLeft(){
        this.currentIndex--
        if(this.currentIndex < 0){
          this.currentIndex = this.allData.length - 1
        }
        this.updateChart()
      },
      // 右点击
      toRight(){
        this.currentIndex++
        if(this.currentIndex > this.allData.length -1){
          this.currentIndex = 0
        }
        this.updateChart()
      }
    }
  }
</script>

<style lang="less" scoped>
.arr-left{
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color:#fff;
}
.arr-right{
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color:#fff;
}
.cat-name{
  position: absolute;
  left: 80%;
  bottom: 20%;
  color:#fff;
}
</style>